require "base64"

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
      
      material['color'] = m.color.to_s
      material['red'] = m.color.red
      material['green'] = m.color.green
      material['blue'] = m.color.blue
      material['alpha'] = m.alpha
      
      material['colorize_type'] = ['shift', 'tint'][m.colorize_type]
      material['colorize_deltas'] = "%.3f - %.3f - %.3f" % m.colorize_deltas
      material['materialType'] = ['solid', 'textured', 'colorized textured'][m.materialType]
      material['texture'] = m.texture ? self.get_texture_filename(m.texture) : ''

      material_hash[m.name] = material
    }

    return material_hash
  end

  def get_thumbnail_base64(name)
    material = Sketchup.active_model.materials[name]
    thumbnail_file = File.join(Sketchup.temp_dir, 'tn_preview.png')
    material.write_thumbnail(thumbnail_file, 128)
    content = File.binread(thumbnail_file)
    return Base64.encode64(content)
  end

  def get_thumbnails_hash
    Sketchup.active_model.materials.map{ |m| 
      [m.name, get_thumbnail_base64(m.name)] 
    }.to_h
  end

  def replace_material(replace, replace_with)
    oldMat = Sketchup.active_model.materials[replace]
    newMat = Sketchup.active_model.materials[replace_with]
    self.replace_entity_material(Sketchup.active_model.entities, oldMat, newMat)
    Sketchup.active_model.materials.remove(oldMat)
  end

  def replace_entity_material(entities, material_to_replace, new_material)
    replaced_definitions = {}

    entities.each { |entity|
      
      if entity.respond_to?(:material) 
        if entity.material.equal?(material_to_replace) 
          entity.material = new_material
        end
      end

      # for entities that have a back material
      if entity.respond_to?(:back_material) 
        if entity.back_material.equal?(material_to_replace) 
          entity.back_material = new_material
        end
      end

      if entity.class == Sketchup::Group
        replace_entity_material(entity.entities, material_to_replace, new_material)
      end

      if entity.class == Sketchup::ComponentInstance
        unless replaced_definitions[entity.definition.guid] != nil
          replace_entity_material(entity.definition.entities, material_to_replace, new_material)
          replaced_definitions[entity.definition.guid] = 1
        end
      end

    }
  end

end