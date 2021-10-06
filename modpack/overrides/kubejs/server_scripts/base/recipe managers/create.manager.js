// priority: 100
// - addConversion
// - addBasin
// - addFilling
// - addEmptying
const temperature = {
    none: 'none',
    heated: "heated",
    superHeated: "superheated"
}
const defaultProcessingTime = 300
/**
* @param {result[]} output will be treated as a pool
* @param {ingredient} input
* @param {process[]} steps 
* @param {number} loops 
* @param {limitedIngredient} transitionalItem 
 */
function addSequencedAssembly(output, input, steps, loops, transitionalItem) {
    console.log("Before cleaning  "+modpackRecipes);
    steps.forEach((recipe) => {
        modpackRecipes = modpackRecipes.filter(item => item !== recipe)
    })
    console.log("AFter cleaning  "+modpackRecipes);

    if (!transitionalItem) transitionalItem = Ingredient.of(input).withNBT({ Process: 1 })
    if (!loops) loops = 1
    console.log("The steps are: " + steps[3].type);
    let recipe = {
        type: "create:sequenced_assembly",
        ingredient: solveIngredient(input),
        transitionalItem: solveIngredient(transitionalItem),
        sequence: steps,
        results: solveResults(output),
        loops: loops
    }
    modpackRecipes.push(recipe)
}
/**
 * @param {result[]} output
 * @param {ingredient} input
 * @param {number} processingTime amount of time in ticks default(300)
 */
function addCrushing(output, input, processingTime) {
    return addProcessingRecipe('create:crushing', solveResults(output), [solveLimitedIngredient(input)], processingTime)
}
/**
 * @param {result} output
 * @param {limitedIngredient} input
 * @param {number} processingTime amount of time in ticks default(150)
 */
function addCutting(output, input, processingTime) {
    return addProcessingRecipe('create:cutting', [solveResult(output)], [solveLimitedIngredient(input)], processingTime)
}
/**
 * @param {result[]} output
 * @param {limitedIngredient} input
 * @param {number} processingTime amount of time in ticks default(150)
 */
function addMilling(output, input, processingTime) {
    return addProcessingRecipe('create:milling', solveResults(output), [solveLimitedIngredient(input)], processingTime)
}
/**
 * @param {result} output
 * @param {limitedIngredient[]} input
 * @param {string} heatRequirement 'none','heated','superHeated' can use temperature object properties instead
 * @param {number} processingTime amount of time in ticks default(150)
 * @param {fluid} fluidOutput
 * @param {fluid[]} fluidInput
 */
function addCompacting(output, input, heatRequirement, processingTime, fluidOutput, fluidInput) {
    return addProcessingRecipe('create:compacting',
        [solveResult(output)].concat(solveFluid(fluidOutput)),
        solveLimitedIngredients(input).concat(solveFluids(fluidInput)),
        processingTime, heatRequirement)
}
/**
 * @param {result[]} output
 * @param {ingredient} input
 * @param {number} processingTime amount of time in ticks default(150)
 */
function addPressing(output, input, processingTime) {
    return addProcessingRecipe('create:pressing', solveResults(output), [solveIngredient(input)], processingTime)
}
/**
 * @param {result[]} output
 * @param {ingredient} input
 * @param {number} processingTime amount of time in ticks default(150)
 */
function addSandpaperPolishing(output, input, processingTime) {
    return addProcessingRecipe('create:sandpaper_polishing', [solveResult(output)], [solveIngredient(input)], processingTime)
}
/**
 * @param {result[]} output
 * @param {ingredient} input
 * @param {number} processingTime amount of time in ticks default(150)
 */
function addSplashing(output, input, processingTime) {
    return addProcessingRecipe('create:splashing', solveResults(output), [solveIngredient(input)], processingTime)
}
/**
 * @param {result[]} output
 * @param {ingredient} input
 * @param {ingredient} heldItem
 */
function addDeploying(output, input, heldItem) {
    return addProcessingRecipe('create:deploying', solveResults(output), solveIngredients([input,heldItem]))
}
/**
 * @param {result} output
 * @param {ingredient} input
 * @param {fluid} fluid 
 */
function addFilling(output, input, fluid) {
    // if (!output && !input) output = fluid
    // let inputArr = []
    // inputArr.push(solveIngredient(input))
    // inputArr.push(solveFluid(fluid))
    return addProcessingRecipe('create:filling', [solveResult(output)], [solveIngredient(input), solveFluid(fluid)])
}
/**
 * @param {result} output
 * @param {ingredient} input
 * @param {fluid} fluid 
 */
function addEmptying(output, input, fluid) {
    // let outputArr = [solveResult(output)]
    // outputArr.push(solveResult(output))
    // outputArr.push(solveFluid(fluid))
    // console.log("emptying " + outputArr);

    return addProcessingRecipe('create:emptying', [solveResult(output), solveFluid(fluid)], [solveLimitedIngredient(input)])
}
/**
 * @param {result[]} output
 * @param {limitedIngredient[]} input
 * @param {string} heatRequirement 'none','heated','superHeated' can use temperature object properties instead
 * @param {number} processingTime amount of time in ticks default(150)
 * @param {fluid[]} fluidOutput
 * @param {fluid[]} fluidInput
 */
function addMixing(output, input, heatRequirement, processingTime, fluidOutput, fluidInput) {
    let inputArr = solveLimitedIngredients(input).concat(solveFluids(fluidInput))
    let outputArr = solveResults(output).concat(solveFluids(fluidOutput))
    return addProcessingRecipe('create:mixing', outputArr, inputArr, processingTime, heatRequirement)
}
function addMechanicalCrafting(output, pattern, key) {
    let recipe = {
        type: "create:mechanical_crafting",
        pattern: pattern,
        result: output,
        key: key,
    };
    modpackRecipes.push(recipe)
    return recipe;
}
function addProcessingRecipe(type, output, input, processingTime, heatRequirement) {
    if (!processingTime) processingTime = defaultProcessingTime
    let recipe = {
        type: type,
        results: output,
        ingredients: input,
        processingTime: processingTime,
        heatRequirement: heatRequirement
    }
    modpackRecipes.push(recipe)
    return recipe
}