const ROLES = {
    '1': {
        name: 'admin',
        description: 'System Admin'
    },
    '2': {
        name: 'user',
        description: 'Can sell and buy Articles'
    },
    '3':{
        name: '', 
        description: ''
    }
}

const ROLE_IDS = Object.keys(ROLES)

const ROLE_NAMES = Object.entries(ROLES).map(role => role[1].name)

module.exports = {
    ROLES,
    ROLE_IDS,
    ROLE_NAMES 
}
