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
}
module.exports = HeavyComputationController;
