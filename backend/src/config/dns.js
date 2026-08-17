import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('DNS servers:', dns.getServers());