const ageInput = document.getElementById('age');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const genderInput = document.getElementById('gender');
const resultText = document.getElementById('result');
const tipText = document.getElementById('tip');
const bmiForm = document.getElementById('bmiForm');
const infoBtn = document.getElementById('infoBtn');
const modal = document.getElementById('infoModal');
const closeModal = document.getElementsByClassName('close')[0];
const infoText = document.getElementById('infoText');

// Chart.js - για το γράφημα BMI
const ctx = document.getElementById('bmiChart').getContext('2d');
let bmiChart;

// Συνάρτηση για τον υπολογισμό του BMI
function calculateBMI(event) {
    event.preventDefault(); // Αποτρέπουμε την ανανέωση της σελίδας

    let height = parseFloat(heightInput.value) / 100;  // Ύψος σε μέτρα
    let weight = parseFloat(weightInput.value);        // Βάρος σε κιλά

    if (!height || !weight) return;

    let bmi = (weight / (height * height)).toFixed(2);
    let result = '';
    let tip = '';
    let resultClass = '';
    let category = '';
    
    // Ανάλυση BMI
    if (bmi < 18.5) {
        result = `BMI: ${bmi} - Αδύνατος`;
        tip = 'Πρόσθεσε περισσότερα θρεπτικά γεύματα στη διατροφή σου!';
        resultClass = 'underweight';
        category = 'Αδύνατος';
    } else if (bmi < 24.9) {
        result = `BMI: ${bmi} - Κανονικός`;
        tip = 'Συνέχισε την ισορροπημένη διατροφή και άσκηση!';
        resultClass = 'normal';
        category = 'Κανονικός';
    } else if (bmi < 29.9) {
        result = `BMI: ${bmi} - Υπέρβαρος`;
        tip = 'Δοκίμασε περισσότερη κίνηση και πιο υγιεινές επιλογές!';
        resultClass = 'overweight';
        category = 'Υπέρβαρος';
    } else {
        result = `BMI: ${bmi} - Παχύσαρκος`;
        tip = 'Συμβουλέψου έναν ειδικό για πιο υγιεινό τρόπο ζωής!';
        resultClass = 'obese';
        category = 'Παχύσαρκος';
    }

    // Εμφάνιση αποτελέσματος
    resultText.innerText = result;
    resultText.className = resultClass;

    // Εμφάνιση συμβουλής
    tipText.innerText = tip;

    // Εμφάνιση του κουμπιού Περισσότερες Πληροφορίες
    infoBtn.style.display = 'block';

    // Εμφάνιση του γραφήματος BMI
    updateChart(category);
}

// Ενημέρωση του γραφήματος BMI
function updateChart(category) {
    if (bmiChart) {
        bmiChart.destroy(); // Καταστρέφουμε το παλιό γράφημα
    }

    // Ορίστε τα δεδομένα για το γράφημα με βάση την κατηγορία BMI
    let chartData = {
        labels: ['Αδύνατος', 'Κανονικός', 'Υπέρβαρος', 'Παχύσαρκος'],
        datasets: [{
            label: 'BMI',
            data: [0, 0, 0, 0],  // Βασικά όλα τα δεδομένα ξεκινούν ως 0
            backgroundColor: [
                'rgba(23, 162, 184, 0.5)',  // Αδύνατος (μπλε)
                'rgba(40, 167, 69, 0.5)',   // Κανονικός (πράσινο)
                'rgba(255, 193, 7, 0.5)',    // Υπέρβαρος (κίτρινο)
                'rgba(220, 53, 69, 0.5)'     // Παχύσαρκος (κόκκινο)
            ],
            borderColor: [
                'rgba(23, 162, 184, 1)',    // Αδύνατος (μπλε)
                'rgba(40, 167, 69, 1)',     // Κανονικός (πράσινο)
                'rgba(255, 193, 7, 1)',     // Υπέρβαρος (κίτρινο)
                'rgba(220, 53, 69, 1)'      // Παχύσαρκος (κόκκινο)
            ],
            borderWidth: 1
        }]
    };

    // Ενημέρωση μόνο της κατηγορίας που υπολογίστηκε για τον χρήστη
    switch (category) {
        case 'Αδύνατος':
            chartData.datasets[0].data[0] = 18.5;
            break;
        case 'Κανονικός':
            chartData.datasets[0].data[1] = 24.9;
            break;
        case 'Υπέρβαρος':
            chartData.datasets[0].data[2] = 29.9;
            break;
        case 'Παχύσαρκος':
            chartData.datasets[0].data[3] = 40;
            break;
    }

    // Δημιουργία ή ενημέρωση του γραφήματος
    bmiChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 40
                }
            }
        }
    });
}

bmiForm.addEventListener('submit', calculateBMI);

// Συνάρτηση που θα εμφανίζει τις περισσότερες πληροφορίες στο modal
infoBtn.addEventListener('click', function() {
    let infoContent = '';
    let infoHeader = '';

    if (resultText.classList.contains('underweight')) {
        infoHeader = 'Αδύνατος - Συμβουλές για την Υγεία';
        infoContent = `
            <p>Η αδυναμία μπορεί να σχετίζεται με προβλήματα υγείας, όπως αδυναμία του ανοσοποιητικού συστήματος και οστεοπόρωση.</p>
            <p>Συμβουλές: Προσθέστε περισσότερες θερμίδες από υγιεινές πηγές (π.χ. ξηροί καρποί, αβοκάντο) και αυξήστε την πρόσληψη πρωτεϊνών.</p>
        `;
    } else if (resultText.classList.contains('normal')) {
        infoHeader = 'Κανονικός - Διατήρηση Υγείας';
        infoContent = `
            <p>Η κανονική σωματική μάζα συνδέεται με την καλύτερη υγεία και μικρότερο κίνδυνο για ασθένειες.</p>
            <p>Συμβουλές: Συνεχίστε με τακτική άσκηση και ισχυρή διατροφή για να διατηρήσετε την υγιή κατάσταση.</p>
        `;
    } else if (resultText.classList.contains('overweight')) {
        infoHeader = 'Υπέρβαρος - Κίνδυνοι και Συμβουλές';
        infoContent = `
            <p>Η υπερβολική σωματική μάζα μπορεί να αυξήσει τον κίνδυνο για καρδιοπάθειες και διαβήτη.</p>
            <p>Συμβουλές: Εστιάστε σε πιο υγιεινές επιλογές τροφίμων και εντάξτε περισσότερη άσκηση στην καθημερινότητά σας.</p>
        `;
    } else if (resultText.classList.contains('obese')) {
        infoHeader = 'Παχύσαρκος - Συμβουλές και Κίνδυνοι';
        infoContent = `
            <p>Η παχυσαρκία συνδέεται με σοβαρούς κινδύνους για την υγεία, όπως καρδιοπάθειες και διαβήτη τύπου 2.</p>
            <p>Συμβουλές: Συμβουλευτείτε έναν ειδικό για να ακολουθήσετε έναν υγιή τρόπο ζωής και να μειώσετε το βάρος σας.</p>
        `;
    }

    infoText.innerHTML = infoContent;
    document.querySelector('.modal-content h2').innerText = infoHeader;
    modal.style.display = "flex";
});


// Κλείσιμο του modal
closeModal.addEventListener('click', function() {
    modal.style.display = "none";
});

// Κλείσιμο modal όταν κάνετε κλικ εκτός από το παράθυρο
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});
