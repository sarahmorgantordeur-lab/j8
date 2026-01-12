// Ce fichier ne connaît rien d'Express ou de l'API. C'est un script isolé qui reçoit des données, travaille, et renvoie un résultat.

// Instructions :
// 1. Importez parentPort et workerData depuis worker_threads.
// 2. Déplacez votre logique de calcul (la boucle de 5 milliards) dans une fonction dédiée.
// 3. Vérifiez si parentPort existe (bonne pratique).
// 4. Utilisez workerData pour récupérer le nombre d'itérations (rendons le code dynamique).
// 5. Une fois le calcul fini, renvoyez le résultat au parent via parentPort.postMessage().


// 1. Importez parentPort et workerData depuis worker_threads.
const { parentPort, workerData } = require("worker_threads");

// 2. Déplacez votre logique de calcul (la boucle de 5 milliards) dans une fonction dédiée.
function heavyComputation(iterations) {
  // TODO: Implémenter la boucle for ici
  // Elle doit retourner le nombre d'itérations effectuées
  for (let i = 0; i < iterations; i++) {
    // Opération vide
  }
  return iterations;
}

// 3. Vérifiez si parentPort existe (bonne pratique).
// Vérification de sécurité : on ne s'exécute que si on est appelé comme worker
if (parentPort) {

    // 4. Utilisez workerData pour récupérer le nombre d'itérations (rendons le code dynamique).
    const iterations = workerData.iterations || 5000000000;
    // Le calcul se fait ici, dans ce thread isolé
    const result = heavyComputation(iterations); // Récursivité pour le nombre d'itérations

    // 5. Une fois le calcul fini, renvoyez le résultat au parent via parentPort.postMessage().
    parentPort.postMessage(result);
}
