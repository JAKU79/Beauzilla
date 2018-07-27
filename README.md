POPIS
-----
Skript upravuje vzled bugů na https://bugzilla.abra.eu/ pro potřeby teamu Documentation. Je určený pro doplněk Tampermonkey. 

ZMĚNY
-----
1.0.4
- AJAX: doplněny symboly pro všechny relevantní stavy bugů z pohledu dokumentace. Zatím jen v sekci See Also.
- opravena chyba v součtu sumComHelp

1.0.3
- refaktorizace kódu

1.0.2
- doplnění semaforu k bugům v See Also. Zelený, pokud obsahuje keyword InHelp, červený, pokud neobsahuje.
- refaktorizace kódu barvy commentů
- tlačítka pro skok na začátek a na konec stránky

1.0.1
- refaktorizace kódu pro součty tagů
- odstranění zbytečných komentů
- odstranění počítadla rychlosti skriptu

1.0.0
- nastavena pevné šířka těla
- odstraněna hlavička (všechny linky jsou v \"patičce\", takže akorát zabírala místo)
- přestylována \"patička\"
- doplněny ikony pro keywordy Published (raketa) a Reviewed (lupa)
- odstraněna tabulka pro výkaz hodin (nevyužíváme)
- odstraněna položka Hardware (to, že se jedná o Linux, je jasné z popisu)
- doplněna barva textu horní položky Status. Zelená, pokud obsahuje řetězec VERIFIED. Červená, pokud jej neobsahuje.
- doplněna barva textu flagu ToPubl v závislosti na tom, je-li +, ? nebo -.
- opravena chyba v součtech tagů InHelp, Help a ToHelp.
- refaktorizace kódu

0.9.0
- Součty tagů inhelp, tohelp a help se označí žlutě, pokud jsou větší než 0. Tagy tohelp a help budou navíc poblikávat (řeší funkce blink_text).
- Doplněny barvy borderů pro hodnoty položky Typ.
- Doplěna barva falgu ToHelp v závislosti na tom, je-li +, ? nebo -.
