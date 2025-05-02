function CalculateMove(boardState){
    /* boardState heeft de huidige staat van het bord
    het bord is een 2D array waar iedere positie een nummer heeft.
    0 = leeg
    1 = geel
    2 = rood
    
    Deze functie moet een nummer tussen 0 en 6 teruggeven voor de rij waarin je jouw kleur wil plaatsen.
    Veel geluk!*/
    return round(random(4,6));
}