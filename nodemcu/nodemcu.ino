

#include <ESP8266WiFi.h>        /* bilblioteca adequada para wifi esp8266 */
#include <ESP8266HTTPClient.h>  /* biblioteca para acesso à API */
#define REDEWIFI "MotoG5"
#define SENHA "09080706"


void setup(){
  //unsigned long tempoAtual = millis();
  Serial.begin(9600);
  WiFi.begin( REDEWIFI , SENHA );
  pinMode(14,OUTPUT);//D5(LED)
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("Connectando à rede WIFI..:");
    digitalWrite(14, HIGH);
    delay(500);
    digitalWrite(14, LOW);
    delay(500);
    //Serial.println(REDEWIFI);
  }
  Serial.print("CONECTADO à rede WIFI ");
  Serial.println(REDEWIFI);
  pinMode(4,INPUT);//D2
  pinMode(5,INPUT);//D1
  pinMode(12,INPUT);//D6
  pinMode(13,INPUT);//D7
  delay(5000);
  Serial.println("FIM SETUP");
}

void loop(){
    if(WiFi.status() == WL_CONNECTED){

     Serial.print(digitalRead(4));//D2
     Serial.print(digitalRead(5));//D1
     Serial.print(digitalRead(12));//D6
     Serial.println(digitalRead(13));//D7

if(((int)digitalRead(4) + (int)digitalRead(5) + (int)digitalRead(12) + (int)digitalRead(13)) > 1){
  digitalWrite(14, HIGH);

    while(((int)digitalRead(4) + (int)digitalRead(5) + (int)digitalRead(12) + (int)digitalRead(13)) > 1){
      Serial.println("Pinos digitais não estão funcionando corretamente!");
     Serial.print(digitalRead(4));//D2
     Serial.print(digitalRead(5));//D1
     Serial.print(digitalRead(12));//D6
     Serial.println(digitalRead(13));//D7
    
    delay(300);
    }
    digitalWrite(14, LOW);  
}
    if(digitalRead(4)){
      env("http://rcfvinicius.pythonanywhere.com/main?p=normal&maquina=maquina1");
      while(digitalRead(4)){
    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(800);

     Serial.print(digitalRead(4));//D2
     Serial.print(digitalRead(5));//D1
     Serial.print(digitalRead(12));//D6
     Serial.println(digitalRead(13));//D7
      }
      delay(1024);
    }

    if(digitalRead(5)){
      env("http://rcfvinicius.pythonanywhere.com/main?p=emergencia&maquina=maquina1");
      while(digitalRead(5)){
    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(200);

    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(800);

          Serial.print(digitalRead(4));//D2
     Serial.print(digitalRead(5));//D1
     Serial.print(digitalRead(12));//D6
     Serial.println(digitalRead(13));//D7
        }
      delay(1024);
    }

    if(digitalRead(12)){
      env("http://rcfvinicius.pythonanywhere.com/main?p=corte&maquina=maquina1");
      while(digitalRead(12)){
    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(200);

    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(200);

    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(800);    

     Serial.print(digitalRead(4));//D2
     Serial.print(digitalRead(5));//D1
     Serial.print(digitalRead(12));//D6
     Serial.println(digitalRead(13));//D7
        }
      delay(1024);      
    }

    if(digitalRead(13)){
      env("http://rcfvinicius.pythonanywhere.com/main?p=quebra&maquina=maquina1"); 
      while(digitalRead(13)){
    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(200);

    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(200);

    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(200);

    digitalWrite(14, HIGH);
    delay(200);
    digitalWrite(14, LOW);
    delay(800);        

     Serial.print(digitalRead(4));//D2
     Serial.print(digitalRead(5));//D1
     Serial.print(digitalRead(12));//D6
     Serial.println(digitalRead(13));//D7
    
        }
      delay(1024);      
    }


      
    Serial.print(".");
    //delay(500);
    Serial.print(".");
    //delay(500);
    Serial.println(".");
    delay(1000);
}else{
  Serial.println("WI-FI fora de alcance");
    digitalWrite(14, HIGH);
    delay(500);
    digitalWrite(14, LOW);
    delay(500);
}}

void env (char *endereco){
    WiFiClient client;
    HTTPClient http;
    http.begin(client, endereco);//http.begin(endereco);
    int httpCode = http.GET();//POST(".")

    if (httpCode > 0) {                   // Verificando o retorno da requisição
    String retorno = http.getString();    // obtendo o retorno da requisição
    Serial.println( retorno );            // mostrando o retorno
  }
  else {
    Serial.print("Erro na requisição:");
  }
  http.end(); 
}
