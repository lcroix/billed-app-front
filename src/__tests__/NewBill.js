/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom/extend-expect"
import userEvent from '@testing-library/user-event'
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import mockStore from "../__mocks__/store";
import router from "../app/Router";

jest.mock("../app/Store", () => mockStore)



describe("Given I am connected as an employee", () => {
  describe("When I send NewBill", () => {
    test("Then the bill must be correctly saved", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      //on mock dans le local storage un utilisateur employé
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBillInit = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy();
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
    test("Then fetches bills from mock API POST", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBillInit = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const formNewBill = screen.getByTestId("form-new-bill");
      expect(formNewBill).toBeTruthy();
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
    test("Then fetches bills from mock API POST", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
    });
    test("Then verify the file bill", async () => {
      jest.spyOn(mockStore, "bills");
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      Object.defineProperty(window, "location", {
        value: { hash: ROUTES_PATH["NewBill"] }, 
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBillInit = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const file = new File(["image"], "image.png", { type: "image/png" });
      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
      const formNewBill = screen.getByTestId("form-new-bill");
      const billFile = screen.getByTestId("file");
      billFile.addEventListener("change", handleChangeFile);
      userEvent.upload(billFile, file);
      expect(billFile.files[0].name).toBeDefined();
      expect(handleChangeFile).toBeCalled();
      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
    })
  })
  // tester si nous avons une alerte lorsque le format du fichier est incorrect
describe('when user is trying to upload a justificatif ', () => {
  let newBill;

  beforeAll(() => {
    // Configurer le corps du document avec le formulaire pour les tests
    document.body.innerHTML = `
      <form data-testid="form-new-bill">
        <input type="file" data-testid="file">
      </form>
    `;

    // Instancier le composant NewBill
    newBill = new NewBill({ document });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays an alert message for invalid file extensions', () => {
    // Spy la méthode window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Créer un faux fichier avec une extension invalide
    const fakeFile = new File([''], 'fakefile.txt', { type: 'text/plain' });

    // Définir le faux fichier comme fichier sélectionné
    const fileInput = document.querySelector(`input[data-testid="file"]`);
    fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    // message d'alerte
    expect(alertSpy).toHaveBeenCalled();

    // l'entrée du fichier soit effacée
    expect(fileInput.value).toBe('');
  });
});

/*----------------------Test d'intégration---------------------- */

// Vérifier que la facture est créée après la soumission du formulaire complété
describe("When the user submits a completed new bill form", () => {
  test("Then the bill is created", async () => {

    // Configurer le HTML pour la nouvelle page de facture
    const html = NewBillUI();
    document.body.innerHTML = html;

    // Définir une fonction de navigation pour changer le nom du chemin
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    // créatien d'employé dans le localStorage
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "azerty@email.com",
      })
    );
    
    // Initialise une nouvelle facture
    const newBill = new NewBill({
      document,
      onNavigate,
      store: null,
      localStorage: window.localStorage,
    });

    // ajoute d'informations
    const validBill = {
      type: "Transports",
      name: "vol en classe affaire",
      date: "2023-06-09",
      amount: 480,
      vat: 50,
      pct: 17,
      commentary: "auccun problème",
      fileUrl: "../images/beyrouth.jpg",
      fileName: "test.jpg",
      status: "pending",
    };

    // Vérifier que l'objet de facture valide est correctement défini
    expect(validBill).toEqual(
      expect.objectContaining({
        type: "Transports",
      name: "vol en classe affaire",
      date: "2023-06-09",
      amount: 480,
      vat: 50,
      pct: 17,
      commentary: "auccun problème",
      fileUrl: "../images/beyrouth.jpg",
      fileName: "test.jpg",
      status: "pending",
      })
    );

    // Remplir le formulaire avec les propriétés valides de l'objet de facturation
    screen.getByTestId("expense-type").value = validBill.type;
    screen.getByTestId("expense-name").value = validBill.name;
    screen.getByTestId("datepicker").value = validBill.date;
    screen.getByTestId("amount").value = validBill.amount;
    screen.getByTestId("vat").value = validBill.vat;
    screen.getByTestId("pct").value = validBill.pct;
    screen.getByTestId("commentary").value = validBill.commentary;

    // nouvelles propriétés de facture avec les propriétés d'objet de facture valides
    newBill.fileName = validBill.fileName;
    newBill.fileUrl = validBill.fileUrl;

    // Mock la méthode updateBill
    newBill.updateBill = jest.fn(); 

    // envoie du fichier
    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e)); 

    const form = screen.getByTestId("form-new-bill");
    form.addEventListener("submit", handleSubmit);

    // Simulation de l'envoie
    fireEvent.submit(form);

    // Vérifiez que les méthodes handleSubmit et updateBill ont été appelées
    expect(handleSubmit).toHaveBeenCalled();
    expect(newBill.updateBill).toHaveBeenCalled();
  });
  })

// Test pour vérifier la gestion des erreurs lors de la récupération des factures
describe("When fetching bills from the API with an error", () => {
// 
//Cette fonction configure un scénario de test pour le composant NewBill lors de la récupération des factures avec une erreur depuis l'API
  const setupNewBillTest = async (mockStore, errorType) => {
    // Mock the 'bills' method of the mock store and console.error method

    jest.spyOn(mockStore, "bills");
    jest.spyOn(console, "error").mockImplementation(() => {});
    // Définir localStorage
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    Object.defineProperty(window, "location", {
      value: { hash: ROUTES_PATH["NewBill"] },
    });
    // Définir le type d'utilisateur et créer l'élément HTML racine

    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
    document.body.innerHTML = `<div id="root"></div>`;
    // Initialise la route et la méthode de navigation 

    router();
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    mockStore.bills.mockImplementationOnce(() => {
      return {
        update: () => {
          return Promise.reject(new Error(`Erreur ${errorType}`));
        },
      };
    });
    // Créer une nouvelle instance Bill
    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: window.localStorage,
    });
    // nouveau formulaire de facture et on l'envoie

    const form = screen.getByTestId("form-new-bill");
    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
    form.addEventListener("submit", handleSubmit);
    fireEvent.submit(form);
    // Wait for promise to resolve

    await new Promise(process.nextTick);
    // Verifie que le message d'erreur est envoyé dans la console 
    expect(console.error).toBeCalled();
  };
    // Ce scénario de test récupère les factures de l'API et échoue avec une erreur 500
    test("fetches error from an API and fails with 500 error", async () => {
      await setupNewBillTest(mockStore, 500);
    });
    // Ce scénario de test récupère les factures de l'API et échoue avec une erreur 404
    test("fetches error from an API and fails with 404 error", async () => {
      await setupNewBillTest(mockStore, 404);
    });
  
 });
