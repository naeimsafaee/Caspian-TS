class NetworkAddress {

    public address: string;
    public balance: number = 0;
    public diff_balance: number = 0;

    public contract_address:string|null = null;
    public is_token:boolean = false;

    constructor(address: string, balance: number = 0 , contract_address:string = "") {
        this.address = address;
        this.balance = balance;

        if(contract_address && contract_address.length != 0){
            this.contract_address = contract_address;
            this.is_token= true;
        }
    }

    public set_balance(new_balance:number){
        this.diff_balance = new_balance - this.balance;
        this.balance = new_balance;
    }

}

export default NetworkAddress