const keyStrokSounds = [ 
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
]

function useKeyboardSound() {

    const playRandomKeystrokeSound = () => {
        const randomSound = keyStrokSounds[Math.floor(Math.random() * keyStrokSounds.length)]

        randomSound.currentTime = 0;
        randomSound.play().catch(error => console.log("Sound play failed:", error))
    }

    return { playRandomKeystrokeSound }
}

export default useKeyboardSound
