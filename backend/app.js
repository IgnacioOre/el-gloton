// Requires
var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
const { arch } = require('os');
const fileUpload = require('express-fileupload'); //para subir imagenes

var nodemailer = require("nodemailer");

// Inicializar variables
var app = express();

// Servir imagenes
app.use(express.static('uploads'))

// Datos BD
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'goloso'
});

mc.connect();

// CORS Middleware
app.use(cors());

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server - puerto 3000 online');
});

// Test
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mnesaje: 'Petición realizada correctamente'
    })
});

// Crea usuario
app.post('/user', function (req, res) {
    console.log(req.body);
    let datosUsuario = {
        userName: req.body.name,
        userEmail: req.body.email,
        userPassword: bcrypt.hashSync(req.body.password, 10),
        userRol: 'Usuario'
    };
    if (mc) {
        mc.query("INSERT INTO usuarios SET ?", datosUsuario, function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al crear el usuario', errors: error
                });
            } else {
                console.log(result);
                let idUsuario = {
                    usuarioId : result.insertId
                }
                let idCliente = result.insertId;
                mc.query("INSERT INTO carrito SET ?", idUsuario, function (error, result) {
                    if (error) {
                        return res.status(400).json({
                            ok: false, mensaje: 'Error al crear el carrito', errors: error
                        });
                    } else {
                        res.status(201).json({
                            ok: true, carrito: result.insertId, usuario: idCliente
                        });
                    }
                })
                
            }
        });
    }
});

// Revisa los datos de autenticación, si son correctos entrega el token, si no entrega el error correspondiente

app.post('/login', (req, res) => {
    var body = req.body;
    mc.query("SELECT * FROM usuarios WHERE userEmail = ?", body.email, function (error, results, fields) {
        if (error) {
            return res(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errors: error
            });
        }
        if (!results.length) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: error
            });
        }

        if (!bcrypt.compareSync(body.password, results[0].userPassword)) {
            return res.status(400).json({
                ok: false, mensaje: "Credenciales incorrectas - password", errors: error
            });
        }

        // Crea un token
        let SEED = 'esta-es-una-semilla';
        let token = jwt.sign({ usuario: results[0].userPassword }, SEED, { expiresIn: 14400 })
        let jsonRes = {
            usuario: results[0],
            id: results[0].userId,
            token: token
        }
        mc.query(`SELECT * FROM carrito JOIN usuarios ON usuarios.userId = carrito.usuarioId WHERE usuarioId = ${jsonRes.id}`, function (error, results, fields) {
            if (error) {
                return res(500).json({
                    ok: false,
                    mensaje: "Error al buscar el carrito",
                    errors: error
                });
            }
            console.log(results);
            res.status(200).json({
                ok: true,
                usuario: jsonRes.usuario,
                id: jsonRes.id,
                token: jsonRes.token,
                carritoId: results[0].carritoId,
            });
        });
        
    });
});








// Modulo para subir imágenes
app.use(fileUpload());


// Obtener todos los productos
app.get('/producto', (req, res) => {
    console.log(req.params.codigo);
    mc.query(`SELECT * FROM productos`
    , function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        return res.send({
            error: false,
            data: results,
            message: 'Lista de productos'
        })
    })
});

// Verificacion con JWT
app.use('/', (req, res, next) => {
    let token = req.query.token;
    let SEED = 'esta-es-una-semilla';
    console.log(token);
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
});


app.post('/producto', function (req, res) {
    console.log(req.body);
    let datosProducto = {
        nombreProducto: req.body.nombreProducto,
        precio: req.body.precio,
    };
    if (mc) {
        mc.query("INSERT INTO productos SET ?", datosProducto, function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al crear el producto', errors: error
                });
            } else {
                res.status(201).json({
                    ok: true, pedido: result
                });
            }
        });
    }
});

app.put('/producto', function (req, res) {
    console.log(req);
    console.log(`UPDATE productos SET nombreProducto = "${req.body.nombreProducto}", precio = ${req.body.precio} WHERE id="${req.body.id}"`)
    mc.query(
        `UPDATE productos SET nombreProducto = "${req.body.nombreProducto}", precio = ${req.body.precio} WHERE id="${req.body.id}"`
        , function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al actualizar el producto con ID' + res.insumoId, errors: error
                });
            } else {
                res.status(201).json({
                    ok: true, producto: result
                });
            }
        });
});

app.delete('/producto/:id', function (req, res) {
    mc.query(`DELETE FROM productos WHERE productos.id=${req.params.id}`, function (error, result) {
        if (error) {
            return res.status(405).json({
                ok: false, mensaje: 'Error al eliminar el producto', errors: error
            });
        } else {
            res.status(200).json({
                ok: true, mensaje: 'Producto borrado con exito', pedido: result
            });
        }
    });
});


app.post('/pedido', function (req, res) {
    console.log(req.body);
    if (mc) {
        mc.query("INSERT INTO pedidos SET ?", req.body, function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al crear el pedido', errors: error
                });
            } else {
                res.status(201).json({
                    ok: true, pedido: result
                });
            }
        });
    }
});

app.post('/detalle-pedido', function (req, res) {
    console.log(req.body);
    if (mc) {
        mc.query("INSERT INTO pedido_producto SET ?", req.body, function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al crear el pedido', errors: error
                });
            } else {
                res.status(201).json({
                    ok: true, pedido: result
                });
            }
        });
    }
});

app.get('/carrito/:id', (req, res) => {
    let id = req.params.id;
    console.log(req.params.id[0]);
    mc.query(`SELECT id, nombreProducto, cantidad, precio FROM item JOIN productos ON item.productoId = productos.id WHERE item.carritoId = ${id};`
    , function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        return res.send({
            error: false,
            data: results,
            message: 'Lista de productos'
        })
    })
});

app.post('/carrito', function (req, res) {
    console.log(req.body);
    let datosPedido = {
        productoId: req.body.productoId,
        carritoId: req.body.carritoId,
        cantidad: req.body.cantidad
    };
    if (mc) {
        mc.query("INSERT INTO item SET ?", datosPedido, function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al crear el item', errors: error
                });
            } else {
                res.status(201).json({
                    ok: true, pedido: result
                });
            }
        });
    }
});

app.delete('/carrito/:id', function (req, res) {
    mc.query(`DELETE FROM item WHERE item.carritoId=${req.params.id}`, function (error, result) {
        if (error) {
            return res.status(405).json({
                ok: false, mensaje: 'Error al eliminar el producto', errors: error
            });
        } else {
            res.status(200).json({
                ok: true, mensaje: 'Producto borrado con exito', pedido: result
            });
        }
    });
});

app.post('/productos', function (req, res) {
    console.log(req.body);
    let datosPedido = {
        productoId: req.body.productoId,
        carritoId: req.body.carritoId,
        cantidad: req.body.cantidad
    };
    if (mc) {
        mc.query("INSERT INTO item SET ?", datosPedido, function (error, result) {
            if (error) {
                return res.status(400).json({
                    ok: false, mensaje: 'Error al crear el item', errors: error
                });
            } else {
                res.status(201).json({
                    ok: true, pedido: result
                });
            }
        });
    }
});


app.get('/pedido', (req, res) => {
    mc.query(`SELECT * FROM pedidos ORDER BY pedidoId DESC`
    , function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        return res.send({
            error: false,
            data: results,
            message: 'Lista de pedidos'
        })
    })
});

app.get('/pedido/:id', (req, res) => {
    console.log(req.params.id);
    mc.query(`SELECT productoId, nombreProducto, cantidad, precio FROM pedido_producto JOIN productos ON pedido_producto.productoId = productos.id WHERE pedidoId = ${req.params.id}`
    , function(error, results, fields) {
        if (error) throw error;
        console.log(results);
        return res.send({
            error: false,
            data: results,
            message: 'Lista de pedidos'
        })
    })
});

app.get('/informe/productos', (req, res) => {
    mc.query(`SELECT sum(cantidad) as total, nombreProducto FROM productos 
    JOIN pedido_producto ON productos.id = pedido_producto.productoId 
    GROUP BY nombreProducto ORDER BY total DESC;`,
    function(error, results, fields) {
        if (error) throw error;
        return res.send({
            error: false,
            data: results,
            message: 'Productos más vendidos'
        })
    })
});

// SELECT productoId, nombreProducto, cantidad, precio FROM pedido_producto JOIN productos ON pedido_producto.productoId = productos.id WHERE pedidoId = 14;







