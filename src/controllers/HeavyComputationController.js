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


// Nous allons simuler une tâche de "Backup" de base de données. Dans la réalité, ce serait une commande complexe. 
// Ici, pour que ça marche sur tous les OS (Linux/Mac/Windows), nous allons simplement lister les fichiers du répertoire courant.

// Instructions :
// 1. Ouvrez src/controllers/HeavyComputationController.js.
// 2. Importez { exec } depuis le module natif child_process.
  // ○ Note : exec lance un shell complet, ce qui permet d'utiliser des pipes | et des jokers, mais attention aux failles de sécurité !
// 3. Ajoutez la méthode backupDb(req, res).

// 1. Importez la classe Worker depuis worker_threads.
const { Worker } = require('worker_threads');

// 2. Importez path pour résoudre le chemin absolu du fichier worker.
const path = require('path');

// 2. Importez { exec } depuis le module natif child_process.
const { exec } = require('child_process');

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

  static async backupDb(req, res) {
    console.log(`[${process.pid}] Demande de backup reçue (Main Thread)`);
    // TODO 1 : Définir la commande système à exécuter
    // Sur Windows ('win32'), utilisez 'dir'. Sur Linux/Mac, utilisez 'ls -la'.
    // Astuce : Utilisez `process.platform` pour vérifier l'OS.
    const command = process.platform === 'win32' ? 'dir' : 'ls -la';

    // TODO 2 : Lancer le processus enfant avec exec()
    // La fonction prend 2 arguments : la commande et un callback (error, stdout, stderr)
    exec(command, (error, stdout, stderr) => {

      // TODO 3 : Gérer le cas où la commande plante (error existe)
      // Renvoyez une erreur 500 au client avec le message.
      if (error) {
        console.error(`[${process.pid}] Erreur lors du backup :`, error.message);
        return res.status(500).json({
          status: 'error',
          message: error.message
        });
      };

      // TODO 4 : Vérifier s'il y a des sorties d'erreurs secondaires (stderr)
      // Ce ne sont pas forcément des crashs, juste des logs d'avertissement du processus.
      // Affichez-les simplement dans un console.warn.
      if (stderr) {
        console.warn(`[${process.pid}] stderr :`, stderr);
      }
      console.log(`[${process.pid}] Backup terminé avec succès`);

      // TODO 5 : Renvoyer le succès au client
      // Le corps de la réponse doit contenir 'stdout' (le texte affiché par la commande ls/dir)
      res.json({
        status: 'success',
        message: 'Backup simulation executed',
        parentPid: process.pid,
        output: stdout
      });
    });
  }
}

// // Bonus : piscina 
// const Piscina = require('piscina');

// // Crée un pool de Workers limité à 4 threads simultanés
// const { parentPort, workerData } = require('worker_threads');

// // Piscina récupère les données via workerData et renvoie un résultat avec return
// module.exports = async function() {
//   const iterations = workerData.iterations || 5000000000;

//   // Simulation d'une tâche CPU-intensive
//   let count = 0;
//   for (let i = 0; i < iterations; i++) {
//     count++; // simple incrément pour simuler le calcul
//   }

//   // Retourne le résultat à Piscina
//   return { iterationsDone: count };
// };


module.exports = HeavyComputationController;
