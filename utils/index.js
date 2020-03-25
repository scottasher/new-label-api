const bcrypt = require('bcrypt');

module.exports = {
    makeid: function (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    isValidPassword: function(password, userpass) {
        // console.log(userpass, password)
        return bcrypt.compareSync(password, userpass);
    },
    generateHash:function(pass) {
        return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
    },
    checkTokenExp: (date) => {
        // console.log('[CHECK TOKEN FUNCTION]', date)
        var tokenCreated = new Date(date)
        var createdPlusOne = new Date(tokenCreated.setDate(tokenCreated.getDate() + 2));
        
        if(tokenCreated < createdPlusOne) {
            // console.log('[if(tokenCreated < createdPlusOne) in CHECK TOKEN FUNCTION]', true)

            return true
        } 

        if(tokenCreated > createdPlusOne) {
            // console.log('[if(tokenCreated > createdPlusOne) CHECK TOKEN FUNCTION]', false)

            return false
        } 

        return 'SOMETHING WENT WRONG'
    }
}
