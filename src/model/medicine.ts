export class Medicine {
  public name: string;
  public genericName: string;
  public brandName: string;
  public manufacturer: string;
  public pharmClass: string;

  constructor(name: string, genericName: string = '', brandName: string = '', manufacturer: string = '', pharmClass: string = '') {
    this.name = name;
    this.genericName = genericName;
    this.brandName = brandName;
    this.manufacturer = manufacturer;
    this.pharmClass = pharmClass;
  }
}