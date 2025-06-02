import { check, body, validationResult } from 'express-validator';

export const validacionPlan = [
  check('nombre')
    .notEmpty().withMessage('El nombre del plan es obligatorio')
    .isLength({ min: 3 }).withMessage('Debe tener al menos 3 caracteres'),

  check('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 5 }).withMessage('Debe tener al menos 5 caracteres'),

  check('nivel')
    .optional()
    .isIn(['básico', 'intermedio', 'avanzado'])
    .withMessage('Nivel inválido. Usa: básico, intermedio o avanzado'),

  body('ejercicios').isArray().withMessage('Ejercicios debe ser un arreglo'),
  body('ejercicios.*.nombre')
    .notEmpty().withMessage('Cada ejercicio debe tener un nombre'),

  body('imagenes').optional().isArray().withMessage('Las imágenes deben ser un arreglo'),
  body('videos').optional().isArray().withMessage('Los videos deben ser un arreglo'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];