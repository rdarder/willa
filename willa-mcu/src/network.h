#ifndef NETWORK_H
#define NETWORK_H

#include <ESP8266WiFi.h>
#include <DNSServer.h>

extern DNSServer dnsServer;

void setupNetwork();
void networkTick();

#endif // NETWORK_H