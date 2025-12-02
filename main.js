document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.stack-section');
    const containerHeight = document.querySelector('.stack-container').offsetHeight;
    const windowHeight = window.innerHeight; // Altezza della finestra

    // Definisce quanto scroll è necessario per spingere fuori ogni sezione (es: 100vh)
    const scrollThreshold = windowHeight; 
    
    // Assegna il punto di inizio dello scroll per ogni sezione
    // La prima sezione inizia a 0, la seconda a 100vh, la terza a 200vh, etc.
    let startPoints = [];
    sections.forEach((section, index) => {
        // Il punto di inizio è il punto in cui la sezione 'index' deve iniziare a scorrere via
        startPoints.push(index * scrollThreshold);
    });

    window.onscroll = () => {
        const scrollPosition = window.scrollY;

        // Itera su tutte le sezioni
        sections.forEach((section, index) => {
            // Non considerare l'ultima sezione, che non deve scorrere via
            if (index < sections.length - 1) { 
                
                // Se la posizione di scroll ha superato il punto di inizio della sezione successiva...
                if (scrollPosition > startPoints[index + 1]) {
                    // Spingi la sezione corrente verso l'alto
                    section.classList.add('pushed-up');
                } else {
                    // Altrimenti, riportala in posizione
                    section.classList.remove('pushed-up');
                }
            }
        });
    };
});