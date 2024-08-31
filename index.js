const dgram = require('node:dgram');
const dnsPacket = require('dns-packet')
const server = dgram.createSocket('udp4');
const mongodbConnect = require("./mongodbConnect/mongodbConnect.js")
const Record = require("./model/model.js")

mongodbConnect();

server.on('error', (err) => {
    console.log("Hello Anuj server")
    console.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {

    const incomingMessage = dnsPacket?.decode(msg);
    const subdomain = incomingMessage?.questions[0]?.name?.toLowerCase();
    const type = incomingMessage?.questions[0]?.type;
    const domain = getDomainValue(subdomain);

    Record.findOne({ domain: domain })
        .then(record => {
            if (record) {
                const result = record.Record.find(record => record.Subdomain === subdomain);
                if (result && Object.keys(result).length > 0) {
                    const answer = dnsPacket.encode({
                        type: 'response',
                        id: incomingMessage.id,
                        flags: dnsPacket.AUTHORITATIVE_ANSWER,
                        questions: incomingMessage.questions,
                        answers: [{
                            type: result.Type,
                            class: incomingMessage?.questions[0]?.class,
                            name: subdomain,
                            data: result.Value
                        }]
                    });

                    server.send(answer, rinfo.port, rinfo.address);
                } else {
                    console.log(`Cannot find record in database add from frontend: ${domain}`);
                    return;
                }
            } else {
                console.log(`Record not found for domain: ${domain}`);
                return;
            }
        })
        .catch(err => {
            console.error('Error retrieving record from MongoDB:', err);
        });
});

function getDomainValue(dnsName) {
    const parts = dnsName.split('.');
    return parts.slice(-2).join('.');
}

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(2000);
