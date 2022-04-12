//o lado do CT importa. Usar com a impressao apontando no mesmo sentido do fluxo (somente monofásico)
//CT sólido(anel) é mais preciso
//a documentaçao diz que o capacitor correto é de 10uF


/* 
1 x CT sensor YHDC SCT-013-000
1 x Burden resistor 18 Ohms if supply voltage is 3.3V, or 33 Ohms if supply voltage is 5V
2 x 10k Ohm resistors (or any equal value resistor pair up to 470k Ohm)
1 x 10uF capacitor
 */



//LCD
//SDA na A4 
//SCL na A5
//#include <Wire.h>
//#define endereco  0x27
//#define colunas   16
//#define linhas    2


#include "EmonLib.h"

EnergyMonitor SCT013;
int pinSCT = A0;   //Pino analógico conectado ao SCT-013


int tensao = 127;
double potencia;



void setup(){
  Serial.begin(9600);
  Serial.println("inicio setup");
  pinMode(2,OUTPUT);
  pinMode(3,OUTPUT);
  pinMode(4,OUTPUT);
  pinMode(5,OUTPUT);

  digitalWrite(2,LOW);digitalWrite(4,LOW);digitalWrite(5,LOW);digitalWrite(3,LOW);
  SCT013.current(pinSCT, 6.0606);//60.607  6.0606
  SCT013.calcIrms(1480);
  delay(2000);
  Serial.println("FIM setup");
}

void loop(){
 
     Serial.println("6.0606");
    
    double Irms = SCT013.calcIrms(1480);   // Calcula o valor da Corrente. testar 5588 (lembrar de mudar nos de baixo)
    potencia = Irms * tensao;          // Calcula o valor da Potencia Instantanea    

    Serial.print("Corrente = ");
    Serial.print(Irms);
    Serial.println(" A");

    Serial.print("Potencia = ");
    Serial.print(potencia);
    Serial.println(" W");

      
    Serial.print(".");
    //delay(500);
    Serial.print(".");
    delay(500);
    Serial.println(".");
    delay(500);


    /* ATUALIZAR VALORES! */
//NORMAL 1494+ 
//EMERGENCIA 683 a 746
//CORTA DE TRAMA 606 a 671
//QUEBRA NO URDUME 155 a 442


    if(potencia > 1000){//colocar o valor aqui
      digitalWrite(2,HIGH);
      while((potencia) > 1000){//colocar o valor aqui
        delay(256);
        Irms = SCT013.calcIrms(1480);
        potencia = Irms * tensao;
        Serial.print("NORMAL: ");
        Serial.println(potencia);
        }
        digitalWrite(2,LOW);
     delay(1000);//                       conferir o tempo de retomada
    }


    if(potencia >= 683 && potencia <= 746){
      digitalWrite(3,HIGH);
      while(potencia >= 683 && potencia <= 746){
        delay(256);
        Irms = SCT013.calcIrms(1480);
        potencia = Irms * tensao;
        Serial.print("EMERGENCIA: ");
        Serial.println(potencia);
        }
        digitalWrite(3,LOW);
        delay(1000);
    }


    if(potencia >= 606 && potencia <= 671){
      digitalWrite(4,HIGH);
      while((potencia) >= 606 && (potencia) <= 671){
        delay(256);
        Irms = SCT013.calcIrms(1480);
        potencia = Irms * tensao;       
        Serial.print("CORTE: "); 
        Serial.println(potencia);
        }
        digitalWrite(4,LOW);
        delay(1000);
    }

        if((potencia) >= 155 && (potencia) <= 442){
      digitalWrite(5,HIGH);
      while((potencia) >= 155 && (potencia) <= 442){
        delay(256);
        Irms = SCT013.calcIrms(1480);
        potencia = Irms * tensao;     
        Serial.print("QUEBRA: ");
        Serial.println(potencia);   
        }
        digitalWrite(5,LOW);
     delay(1000);
    }



/*
digitalWrite(2, HIGH);
delay(1000);
digitalWrite(2, LOW);
digitalWrite(3, HIGH);
delay(1000);
digitalWrite(3, LOW);   
digitalWrite(4, HIGH);
delay(1000);
digitalWrite(4, LOW);
digitalWrite(5, HIGH);
delay(1000);
digitalWrite(5, LOW);
*/

}
