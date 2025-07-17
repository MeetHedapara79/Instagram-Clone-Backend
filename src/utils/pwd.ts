import bcrypt from "bcrypt";

const setPwd = async(p: string) =>{
    const salt =  bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(p, salt)
    return hash
}

const checkPwd = (pwd:string, hash:string) =>{
    let check = bcrypt.compareSync(pwd, hash);
    return check
}

export {setPwd, checkPwd}