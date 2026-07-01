export default async function profile(req, res)
{
    res.status(200).render("pages/profile", {
        user: req.session.user,
        isPerfil: true,
    })
}