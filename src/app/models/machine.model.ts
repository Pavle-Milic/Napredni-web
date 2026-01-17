import { User } from "./user.model"; // Pretpostavljam da imas user model, ako ne, stavi 'any'

export interface Machine {
  id: number;
  name: string;

  // BITNO: Status mora da pokriva ono sto salje Java (STOPPED, RUNNING)
  // Stavio sam 'string' kao rezervu da ne puca ako dodas novi status
  status: 'STOPPED' | 'RUNNING' | string;


  createdBy: User;

  active: boolean;

  // Ovo moze da ostane string, ali ako zelis datumski objekat: Date
  createdAt: string;
  // Neka bude string jer ga u HTML-u formatiramo sa pipe-om | date
}
