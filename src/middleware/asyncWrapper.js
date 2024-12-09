
const asyncWrapper = (fu) => {
    return async (req, res, next) => {
        try {
            await fu(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = asyncWrapper