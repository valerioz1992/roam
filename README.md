# ROAM — prototipo iniziale

Questa è una prima versione installabile come PWA. Include i 182 Paesi presenti nel file Excel aggiornato e usa i valori esistenti senza completare automaticamente i campi vuoti.

## Funzioni incluse
- Ricerca testuale e filtri per mese, continente, visto e tipologia di viaggio.
- Schede destinazione con i dati presenti nel foglio Excel.
- Preferiti salvati localmente sul dispositivo.
- Confronto fino a 3 destinazioni.
- Layout responsive per telefono e computer.

## Come provarla sul computer
Per motivi di sicurezza del browser, avvia un piccolo server locale nella cartella estratta:

```bash
python -m http.server 8000
```

Poi apri http://localhost:8000.

## Come renderla pubblica gratuitamente
Puoi pubblicare i file statici su GitHub Pages. Crea un repository GitHub, carica tutti i file contenuti in questa cartella e abilita Settings → Pages → Deploy from a branch → main / root. Quando sarà pubblicata tramite HTTPS, potrai aprirla dal telefono e aggiungerla alla schermata Home.

## Limiti attuali
- Non c'è ancora un account utente né sincronizzazione tra dispositivi. I preferiti restano sul browser/dispositivo.
- I dati su visti, sicurezza e costi non sono aggiornati automaticamente. Verificali sempre su fonti ufficiali prima di partire.
- È un prototipo iniziale: nome ROAM non ancora sottoposto a verifica legale definitiva.
