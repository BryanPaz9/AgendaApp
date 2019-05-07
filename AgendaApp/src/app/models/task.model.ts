export class Task{
    constructor(
        public _id: string,
        public titulo: string,
        public descripcion: string,
        public lugar: string,
        public fechaInicio: string,
        public fechaFin: string,
        public user: string,
    ){}
};
