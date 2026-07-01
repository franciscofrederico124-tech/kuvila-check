export default logout(req, res)
{

    res.status(200).render("pages/profile", {
        isPerfil: true
    });
}