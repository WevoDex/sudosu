import express from 'express';
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';
import cheerio from 'cheerio';
import { createServer } from 'http';
import { parse } from 'url';

const app = express();

const username = 'kalikex1';
const password = 'Adminhaxor__11';
const proxyUrl = `http://${username}:${password}@unblock.oxylabs.io:60000`;
const agent = new HttpsProxyAgent(proxyUrl);

// Ignore the certificate
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(express.json());

app.post('/api/lookup/:ip', async (req, res) => {
  const ip = req.params.ip;
  const url = `https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/${ip}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      agent: agent,
    });
    const html = await response.text();

    const $ = cheerio.load(html);

    const tableData = {};
    $('tbody tr').each((index, row) => {
      const key = $(row).find('td').eq(0).text().trim();
      const value = $(row).find('td').eq(1).text().trim();

      switch (key) {
        case 'IP Address':
          tableData.ipAddress = value;
          break;
        case 'Country':
          tableData.country = value;
          break;
        case 'Fraud ScoreIP Reputation':
          tableData.fraudScore = value;
          break;
        case 'Mail SPAM Block List':
          tableData.mailSpamBlockList = value;
          break;
        case 'Proxy/VPN Detection':
          tableData.proxyVpnDetection = value.replace(/\n\s+/g, ' '); 
          break;
        case 'Bot Activity':
          tableData.botActivity = value;
          break;
        case 'Abuse Velocity New':
          tableData.abuseVelocity = value;
          break;
        case 'City':
          tableData.city = value;
          break;
        case 'Region':
          tableData.region = value;
          break;
        case 'ISP':
          tableData.isp = value;
          break;
        case 'ASN':
          tableData.asn = value;
          break;
        case 'Organization':
          tableData.organization = value;
          break;
        case 'IP Connection Type':
          tableData.ipConnectionType = value;
          break;
        case 'Time Zone':
          tableData.timeZone = value;
          break;
        case 'Latitude':
          tableData.latitude = value;
          break;
        case 'Longitude':
          tableData.longitude = value;
          break;
        case 'CIDR IP Address Subnet':
          tableData.cidrIpAddressSubnet = value;
          break;
        default:
          tableData[key] = value;
      }
    });

    res.json(tableData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default (req, res) => {
  const parsedUrl = parse(req.url, true);
  app.handle(req, res, parsedUrl);
};
