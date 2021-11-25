

export class AuthUser {
    constructor(m) {

        this.id = null;
        this.token = null;
        this.email = null;
        this.username = null;

        this.loadFromJSON(m);
    }

    loadFromJSON(m) {
        console.log(m);
        if (!m || !m.user ) {
            return this;
        }

        this.id = m.user.id ? m.user.id : m.user.accountName
        this.token = m.token;
        this.username = m.user.username;
        this.email = m.user.email;

        if (m.organization) {
            this.organization = new OrganizationUnit(m.organization);
        }

        return this;
    }
}

