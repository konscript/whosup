require "zurb-foundation"

output_style = (environment == :production) ? :compressed : :expanded
css_dir = "css"
sass_dir = "scss"
sass_options = {:debug_info => true}