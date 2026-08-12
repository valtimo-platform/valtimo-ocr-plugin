# Release notes

Overzicht van wijzigingen per versie van de Valtimo OCR-plugin.

## 1.0.2
De Mistral API-sleutel wordt niet meer naar de browserconsole geschreven terwijl een beheerder de plugin configureert. Dat gebeurde bij elke toetsaanslag.

## 1.0.1
De tekst die uit een gescand document is herkend wordt niet meer naar de serverlog geschreven. Dat gebeurde altijd en was niet uit te zetten, waardoor de inhoud van bijvoorbeeld ingekomen post in de logging terechtkwam.

## 1.0.0
Ondersteuning voor Valtimo 13: overgestapt van Camunda naar Operaton en van Angular 17 naar Angular 19. Deze versie is niet geschikt voor Valtimo 12; gebruik daarvoor 0.1.1.

## 0.1.1
Eerste release onder de naam Valtimo OCR (voorheen doc-scanner): tekst herkennen uit afbeeldingen en PDFs via Mistral. Ondergebracht in een eigen repository met voorbeeldapplicatie, aparte documentatie en een PR-checks workflow.
