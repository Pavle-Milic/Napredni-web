export interface Machine{
  id:number;
  name:string;
  status:'ON'|'OFF';
  createdBy: number; //korisnik
  active: boolean;
  createdAt: string; //datum
}
