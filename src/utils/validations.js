export const doUIValidations = (stockSymbol, monthlySalary, contributionPercentage, startDate, soldDate) => {
    let warnings = {};
    let isValid = true;

    if (!stockSymbol) {
        warnings.stockSymbol = 'אנא הכנס את סימול המניה';
        isValid = false;
    }
    if (!monthlySalary || isNaN(monthlySalary)) {
        warnings.monthlySalary = 'אנא הכנס את המשכורת החודשית';
        isValid = false;
    }
    if (!contributionPercentage || isNaN(contributionPercentage)) {
        warnings.contributionPercentage = 'אנא הכנס את אחוז ההפרשה';
        isValid = false;
    }
    if (!startDate) {
        warnings.startDate = 'אנא הכנס את תאריך ההתחלה';
        isValid = false;
    }
    if (!soldDate) {
        warnings.soldDate = 'אנא הכנס את תאריך המכירה';
        isValid = false;
    }
    const startDateObj = new Date(startDate);
    const soldDateObj = new Date(soldDate);
    const today = new Date();

    if (startDate && soldDate) {
        if (soldDateObj < startDateObj) {
            warnings.result = 'תאריך המכירה לא יכול להיות קטן מתאריך ההתחלה';
            isValid = false;
        } else if (monthsDiff(startDateObj, soldDateObj) < 6) {
            warnings.result = 'הפער בין תאריך ההתחלה לתאריך המכירה צריך להיות לפחות 6 חודשים';
            isValid = false;
        } else if (soldDateObj > today) {
            warnings.result = 'תאריך המכירה לא יכול להיות בעתיד';
            isValid = false;
        }
    }

    return { isValid, warnings };
};

const monthsDiff = (d1, d2) => {
    return (d2.getFullYear() * 12 + d2.getMonth()) - (d1.getFullYear() * 12 + d1.getMonth());
};
