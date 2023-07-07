#!/bin/bash

#version: 1.0.1

git push

# Obtiene la lista de ramas del proyecto
#branches=$(git branch | sed 's/\*//' | sed 's/ //g')

source_branch=production
branches=(prod-PymesBulevar prod-Dujo prod-ElGuajirito prod-GranComercial prod-Acubamos prod-Apululu prod-Mercado+ prod-BCSuministros prod-Bianca prod-DCero prod-Donato prod-DondeDorian prod-LaLuciana prod-LaPolimita prod-MisterDamian prod-Pruebalo prod-Atec  prod-Caracol prod-ElAjibe prod-Gelato prod-GranComerial-Mayoristas prod-GranFerretero prod-HavTel prod-HomeDeli prod-ITH prod-LaCeiba prod-LaTorre prod-LasPraderas prod-MCV prod-MM_Caribe prod-Marlin prod-MercadosPresidente prod-MiBulevar prod-MiBulevar-Alcansan prod-MiBulevar-Aligan prod-MiBulevar-ComercioCienfueg prod-MiBulevar-Cupetcfg prod-MiBulevar-Cupetgrm prod-MiBulevar-Cupethol prod-MiBulevar-Cupetltu prod-MiBulevar-Epueblo prod-MiBulevar-Etecsa prod-MiBulevar-Genesis prod-MiBulevar-Mercatuaba prod-MiBulevar-Ofa prod-MiBulevar-TiendasPatrimonio prod-MiBulevar-Trd prod-MundoCopextel prod-OpticasTheia prod-Palmares prod-PeopleGoTo prod-RapidMultiservice prod-Supermax prod-Umbralf prod-VeoVeo)

# Convierte la lista de ramas en un arreglo
#IFS=$'\n' read -d '' -a branches_arr <<< "$branches"
#IFS=$'\n' read -d '' -a branches_arr <<< "$branches"

# Pide al usuario que seleccione las ramas
#echo "¿Qué ramas quieres actualizar? (separa las ramas por espacios)"
#read -a selected_branches

# Hace merge desde la rama seleccionada hacia las ramas seleccionadas
for branch in "${branches[@]}"; do
  # Verifica que la rama seleccionada exista en el proyecto
  if [[ " ${branches[@]} " =~ " ${branch} " ]]; then
    git checkout "$branch" &&
    git pull &&
    git merge --no-ff -m "Merge $source_branch into $branch" "$source_branch" &&
    git push
  else
    echo "La rama $branch no existe en el proyecto."
  fi
done

# Regresa a la rama original
git checkout "$source_branch"
