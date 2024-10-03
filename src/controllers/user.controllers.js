const updateUser = async(req,res) => {
    try{
        res.send("Hola")
    }catch(e){
        console.error(e);
    }
}

module.exports = {updateUser};