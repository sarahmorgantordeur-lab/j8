// Instructions :
// 1. Importez la classe Worker depuis worker_threads.
// 2. Importez path pour résoudre le chemin absolu du fichier worker.
// 3. Créez la méthode statique workerTask(req, res).
// 4. Instanciez un nouveau Worker en pointant vers votre fichier worker.js.
// 5. Passez les données via l'option workerData.
// 6. Écoutez les événements du worker :
    // ○ message : Le travail est fini, on envoie la réponse HTTP.
    // ○ error : Le worker a planté.
    // ○ exit : Le worker s'est arrêté (utile pour le debug).

// 1. Importez la classe Worker depuis worker_threads.
const { Worker } = require('worker_threads');

// 2. Importez path pour résoudre le chemin absolu du fichier worker.
const path = require('path');

// Bonus : piscina 
const Piscina = require('piscina');
// Crée un pool de Workers limité à 4 threads simultanés
const pool = new Piscina({
  filename: path.resolve(__dirname, "../workers/worker.js"),
  maxThreads: 4,
});


class HeavyComputationController {
  static async blockingTask(req, res) {
    console.log(`[${process.pid}] Début de la tâche bloquante...`);
    // TODO: Initialiser le temps de départ
    const startTime = Date.now();
    // TODO: Créer une boucle for de 0 à 5 000 000 000
    // (Cette opération ne fait rien d'autre qu'incrémenter un compteur)
    for (let i = 0; i < 5000000000; i++) {
      // Opération vide
    }
    // TODO: Calculer la durée totale
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`[${process.pid}] Tâche terminée.`);
    // TODO: Renvoyer la réponse JSON
    res.json({ duration });
  }

  // 3. Créez la méthode statique workerTask(req, res).
  static async workerTask(req, res) {
    console.log(`[${process.pid}] Délégation au worker...`);
    const start = Date.now();

    // 4. Instanciez un nouveau Worker en pointant vers votre fichier worker.js.
    // Chemin absolu obligatoire pour les Workers
    const workerPath = path.resolve(__dirname, "../workers/worker.js");
    // Création du thread

    // 5. Passez les données via l'option workerData.
    const worker = new Worker(workerPath, {
      workerData: { iterations: 5000000000 },
    });

    // 6. Écoutez les événements du worker :
    // Écoute du succès ; message : Le travail est fini, on envoie la réponse HTTP.
    worker.on("message", (result) => {
      const duration = Date.now() - start;
      console.log(`[${process.pid}] Worker a fini en ${duration}ms`);
      res.json({
        status: "success",
        mode: "non-blocking (worker)",
        pid: process.pid, // Notez que c'est toujours le même PID parent qui répond
        duration: `${duration}ms`,
        result: result,
      });
    });

    // Écoute des erreurs ; error : Le worker a planté.
    worker.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });

    // Écoute de la fin ; exit : Le worker s'est arrêté (utile pour le debug).
    worker.on("exit", (code) => {
      if (code !== 0)
        console.warn(`[${process.pid}] Worker arrêté avec le code ${code}`);
      else console.log(`[${process.pid}] Worker terminé correctement`);
    });

  }
}

module.exports = HeavyComputationController;
