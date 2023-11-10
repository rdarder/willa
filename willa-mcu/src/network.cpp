#include "network.h"
const char *ssid = "willa";

IPAddress local_IP(10, 0, 9, 1);
IPAddress gateway(0, 0, 0, 0);
IPAddress subnet(255, 255, 255, 0);

DNSServer dnsServer;

void setupNetwork()
{
    WiFi.softAPConfig(local_IP, gateway, subnet);
    WiFi.softAP(ssid, NULL);
    IPAddress IP = WiFi.softAPIP();
    Serial.print("AP IP address: ");
    Serial.println(IP);
    dnsServer.start(53, "*", WiFi.softAPIP());
    Serial.print("DNS server started");
}
void networkTick()
{
    dnsServer.processNextRequest();
}