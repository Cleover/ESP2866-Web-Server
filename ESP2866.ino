// @file WebServer.ino
// @brief Example implementation using the ESP8266 WebServer.
//
// See also README.md for instructions and hints.
//
// Changelog:
// 07.01.2022 creation, first version, edits

#include <Arduino.h>
#include <ESP8266WebServer.h>
#include <DNSServer.h>
#include <LittleFS.h> // This file system is used.

const IPAddress apIp(192, 168, 0, 1);
DNSServer dnsServer;
// mark parameters not used in example
#define UNUSED __attribute__((unused))

// TRACE output simplified, can be deactivated here
#define TRACE(...) Serial.printf(__VA_ARGS__)

// name of the server. You reach it using http://curiosity.lan
#define HOSTNAME "curiosity.lan"

// need a WebServer for http access on port 80.
ESP8266WebServer server(80);

// The text of builtin files are in this header file
#include "builtinfiles.h"

std::vector<String> messages;

void handleRedirect() // redirect to the main page
{
  server.sendHeader("Location", "http://curiosity.lan/index.html", true);
  server.send(302, "text/plain", "");
}

// This function is called when the sysInfo service was requested.
void handleSysInfo()
{
  String result;

  FSInfo fs_info;
  LittleFS.info(fs_info);

  result += "{\n";
  result += "  \"flashSize\": " + String(ESP.getFlashChipSize()) + ",\n";
  result += "  \"freeHeap\": " + String(ESP.getFreeHeap()) + ",\n";
  result += "  \"fsTotalBytes\": " + String(fs_info.totalBytes) + ",\n";
  result += "  \"fsUsedBytes\": " + String(fs_info.usedBytes) + "\n";
  result += "}";

  server.sendHeader("Cache-Control", "no-cache");
  server.send(200, "application/json; charset=utf-8", result);
} // handleSysInfo()

void sendMessage()
{
  messages.push_back(server.arg(0) + "<;>" + server.arg(1));
  server.send(200);       
  //Response to the HTTP request

} // handleSysInfo()

// This function is called when the messages service was requested.
void getMessages()
{

  String result;


  for(int i=0; i<messages.size(); i++) 
  {
    // If its the last one
    if(i+1 == messages.size()){
      result += messages[i];
    }else{
      result += messages[i] + "|";
    }
  }
  
  server.sendHeader("Cache-Control", "no-cache");
  server.send(200, "text/plain; charset=utf-8", result);
} // getMessages()

// Setup everything to make the webserver work.
void setup(void)
{
  delay(3000); // wait for serial monitor to start completely.

  // Use Serial port for some trace information from the example
  Serial.begin(115200);
  Serial.setDebugOutput(false);

  TRACE("Starting WebServer...\n");

  TRACE("Mounting the filesystem...\n");
  if (!LittleFS.begin())
  {
    TRACE("could not mount the filesystem...\n");
    delay(2000);
    ESP.restart();
  }

  // start WiFI
  WiFi.mode(WIFI_AP);
  WiFi.persistent(false);
  WiFi.disconnect(true);
  WiFi.softAPConfig(apIp, apIp, IPAddress(255, 255, 255, 0));
  WiFi.softAP("Curiosity", nullptr, 1);
  // allow to address the device by the given name e.g. http://webserver
  WiFi.setHostname(HOSTNAME);
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(53, "*", apIp);

  TRACE("Connect to WiFi...\n");

  TRACE("Register service handlers...\n");

  // register a redirect handler when only domain name is given.
  server.on("/", HTTP_GET, handleRedirect);

  // register REST service for system info
  server.on("/$sysinfo", HTTP_GET, handleSysInfo);

  // register REST service for fetching messages
  server.on("/$messages", HTTP_GET, getMessages);

  // register REST service for sending messages

  server.on("/$send", HTTP_GET, sendMessage);

  
  // enable CORS header in webserver results
  server.enableCORS(true);

  TRACE("Serving static...\n");
  // serve all static files
  server.serveStatic("/", LittleFS, "/");
  TRACE("Served...\n");
  // handle cases when file is not found
  server.onNotFound(handleRedirect);
  TRACE("Registered onNotFound...\n");
  server.begin();
  TRACE("Server begun...");
} // setup

// run the server...
void loop(void)
{
  dnsServer.processNextRequest();
  server.handleClient();
} // loop()

// end.
