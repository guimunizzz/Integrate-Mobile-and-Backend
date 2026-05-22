export class Categoria {
  private id: number = 0;
  private nome: string = "";

  constructor(pNome: string, pId: number) {
    this.Nome = pNome;
    this.Id = pId;
  }

  get Id(): number {
    return this.id;
  }

  get Nome() {
    return this.nome;
  }

  set Id(value: number) {
    this.validarId(value);
    this.id = value;
  }
  set Nome(value: string) {
    this.validarNome(value);
    this.nome = value.trim();
  }

  validarId(value: number): boolean {
    if (value < 0) {
      throw new Error("ID deve ser um número positivo.");
    }
    return true;
  }

  validarNome(value: string): boolean {
    if (!value.trim() || value.trim().length < 4) {
      throw new Error(
        "Nome não pode ser vazio e deve ter pelo menos 4 caracteres.",
      );
    }
    return true;
  }
}
