function playMenuMoveSFX() {
    let menuMvSFX = new Audio("/static/sfx/snd_menumove.wav");
    menuMvSFX.volume = 0.7;
    menuMvSFX.loop = false;
    menuMvSFX.play();
}

playMenuMoveSFX();