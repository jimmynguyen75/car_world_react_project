
function AuthHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.TokenWeb) {
        return { Authorization: 'Bearer ' + user.TokenWeb };
    } else {
        return {};
    }
}

export default AuthHeader;
