<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Arduino_Logo.svg" width="80" alt="Arduino Logo" />

# 7-Segment Clock

**Reloj digital con Arduino Mega 2560 y display de 4 dígitos**

[![Arduino](https://img.shields.io/badge/Arduino-Mega_2560-00979D?style=for-the-badge&logo=arduino&logoColor=white)](https://www.arduino.cc/)
[![C++](https://img.shields.io/badge/Language-C%2B%2B-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)](https://www.arduino.cc/)
[![Display](https://img.shields.io/badge/Display-7--Segment-555555?style=for-the-badge)](https://github.com/adrian200223/Simple5641AS)

---

*Reloj digital basado en multiplexación de un display 7 segmentos de 4 dígitos.*

</div>

---
## Descripción

Un pequeño proyecto de electrónica basado en un **Arduino Mega 2560** y un display de **4 dígitos y 7 segmentos**.

El reloj muestra la hora en formato `HH.MM` y utiliza `millis()` para controlar el tiempo y multiplexación para gestionar el display.

---

## Hardware

- Arduino Mega 2560
- Display 7 segmentos de 4 dígitos

### Pinout

| Pin | Función |
|---|---|
| D2–D8 | Segmentos A–G |
| D9 | Punto decimal |
| D10–D13 | Dígitos 1–4 |

---

## Configuración

La hora inicial se establece directamente en el código mediante `rawTime`:

```cpp
int rawTime = (12 * (60 * 60)) + (45 * 60); // 12:45
