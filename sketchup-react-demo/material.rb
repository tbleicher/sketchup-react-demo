module SketchupReactDemo
  module_function
  
  def get_texture_filename(texture)
    texture.filename.index('\\') ?
      texture.filename.split('\\')[-1] :
      File.basename(texture.filename)
  end

  def get_material_hash
    material_hash = {}
    materials = Sketchup.active_model.materials

    materials.each { |m|
      #puts m.name
      material = {}
      material['name'] = m.name
      material['display_name'] = m.display_name
      
      material['alpha'] = m.alpha
      material['color'] = m.color.to_s
      material['colorize_type'] = m.colorize_type
      material['colorize_deltas'] = m.colorize_deltas
      material['materialType'] = m.materialType
      material['texture'] = m.texture ? self.get_texture_filename(m.texture) : 'none'

      material_hash[m.name] = material
    }

    return material_hash
  end

end