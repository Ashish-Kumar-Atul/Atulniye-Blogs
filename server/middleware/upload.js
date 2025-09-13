const multer = require('multer')

const storage = multer.memoryStorage();
// const upload = multer({
//     storage:storage,
//     limits:{fileSize:5*1024*1024},
//     fileFilter:(req,file,cb) => {
//         if(file.mimetype.startsWith("image/")){
//             cb(null, true);
//         } else{
//             cb(new Error("Only image files allowed"), false);
//         }
//     }
// });
const upload = multer({storage});
module.exports = upload;