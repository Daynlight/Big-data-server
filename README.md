<div align=center>

# Big Data Server

</div>


Wymagania:

- [ ] Zbuduj i uruchom usługę WWW (API + prosty klient), która umożliwia wysyłanie i pobieranie dużych plików w sposób odporny na problemy sieciowe (zerwane połączenia, ponowienia żądań).
- [ ] Upload w częściach (chunked upload) – klient dzieli plik na fragmenty i wysyła je osobno.
- [ ] Wznawianie uploadu – po przerwaniu transferu da się go kontynuować bez wysyłania wszystkiego od nowa.
- [ ] Integralność – fragmenty i/lub cały plik są weryfikowane checksumą (np. SHA-256); serwer odrzuca błędne dane.
- [ ] Pobieranie z wznawianiem – wsparcie dla Range (lub równoważny mechanizm).
- [ ] Minimalny klient (CLI lub skrypt), który potrafi wykonać upload i wznowienie.
