import java.util.HashMap;
import java.util.ArrayList;
import Jama.*;
import java.io.*;

/** 
 * The constructor and data values are loaded at the time of app start. 
 * Each match function is called on an individual basis (e.g. search, etc)
 */
public class RecommendValues {

    private int numNutrients = 3, NUMTOP = 3, numCharacteristics;
    private HashMap<String, float[]> foodData;
    private HashMap<String, Float>[] sorted;
    private float TOLERANCE = 100000;

    /**
     * The main point of this constructor is to process the data into an optimal algorithm form. 
     * 
     * @param foodData: 
     *                  Key: String, name of food
     *                  Value: float[], caloric/nutritional values for corresponding food
     */
    public RecommendValues(HashMap<String, float[]> foodData) {
        this.foodData = foodData;
        for (float[] characteristics : foodData.values()) {
            this.numCharacteristics = characteristics.length;
            break;
        }
        float[] means = getMeans();
        this.sorted = getSorted(foodData, means);
    }

    //------------------------------------------------------------------------------------------------------------------
    // Get the mean of all foods

    /**
     * Wrapper class for functions in multithreading. 
     */
    private class GetMean extends Thread {
        private HashMap<String, float[]> data;
        private int startIndex, endIndex, location;
        private float[] means;

        public GetMean(
                        HashMap<String, float[]> data, 
                        int startIndex, 
                        int endIndex, 
                        float[] means, 
                        int location
                      ) 
        {
            this.data = data;
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.means = means;
            this.location = location;
        }

        public void run() {
            try {
                // String[] keys = ;
                for (int i = startIndex; i < endIndex; i++) {
                    means[location] += data.get(location)[i];
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Takes in a data hash and returns the means of all the float[] arrays in the same indicies. 
     * 
     * @param data: dataset in HashMap data structure with float[] arrays as values. 
     * 
     * @return Returns mean of all float[] arrays in a float[]
     */
    private float[] getMeans() {
        float[] means = new float[numNutrients];
        try {
            for (float[] vals : foodData.values()) {
                for (int i = 0; i < numNutrients; i++) {
                    if (vals[i] == vals[i] && vals[i] != Float.POSITIVE_INFINITY && vals[i] != Float.NEGATIVE_INFINITY) {
                        means[i] += vals[i];
                    }
                }
                // GetMean mean = new GetMean(data, i, means);
                // mean.start();
            }
            for (int i = 0; i < numNutrients; i++) {
                means[i] /= foodData.size();
            }
            // Thread.sleep(500);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return means;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Sort data array

    /**
     * Wrapper class for supporting multithreading. 
     */
    private class GetSorted extends Thread {
        private HashMap<String, float[]> data;
        private float mean;
        private int index;
        private ArrayList<String> foods;

        public GetSorted(HashMap<String, float[]> data, float[] means, int index, ArrayList<String> foods) {
            this.data = data;
            this.index = index;
            this.mean = means[index];
            this.foods = foods;
        }

        public void run() {
            for (String key : data.keySet()) {
                if (data.get(key)[index] > mean) {
                    foods.add(key);
                }
            }
        }

    }

    /**
     * Gets the foods that are higher in value than the mean. 
     */
    private HashMap<String, Float>[] getSorted(HashMap<String, float[]> foodData, float[] means) {
        sorted = new HashMap[numNutrients];
        for (int i = 0; i < numNutrients; i++) {
            sorted[i] = new HashMap<String, Float>();
        }
        try {
            for (String key : foodData.keySet()) {
                for (int i = 0; i < numNutrients; i++) {
                    // GetSorted sorter = new GetSorted(foodData, means, i, sorted[i]);
                    // sorter.start();
                    float amount = foodData.get(key)[i];
                    if (amount > means[i]) {
                        sorted[i].put(key, amount);
                    }
                }
            }
            // Thread.sleep(500);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sorted;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Case-by-case Matching

    /**
     * Takes in a user for caloric/nutritional values and information 
     * and returns a dictionary of possible common food combinations. 
     * 
     * Motivation: 
     *      Since we have millions of foods in the dataset, 
     *      resulting in many combinations, this matching algorithm must be fast.
     * 
     * Methodology:
     *      
     *      
     * @param user: The user to calculate meal data from. 
     * 
     * @return Returns an ArrayList of HashMap of combinations of foods
     *          e.g. AList {
     *                  HashMap {"broccoli" : 300, "pork" : 500, "potato" : 1000},
     *                  ...
     *              }
     */
    public ArrayList<HashMap<String, Float>> match(User user) {
        float[] toIntake = getMealIntake(user);
        ArrayList<String>[] topIngredientsNames = new ArrayList[numNutrients];
        for (int i = 0; i < numNutrients; i++) {
            topIngredientsNames[i] = new ArrayList<String>();
        }
        getTopIngredients(toIntake, topIngredientsNames);
        ArrayList<HashMap<String, Float>> combinations = new ArrayList<HashMap<String, Float>>();
        getCombinations(topIngredientsNames, combinations, toIntake);

        return combinations;
    }

    private void getCombinations(
                                    ArrayList<String>[] topIngredientsNames, 
                                    ArrayList<HashMap<String, Float>> combinations, 
                                    float[] toIntake
                                ) 
    {
        double[] intake = new double[toIntake.length];
        for (int i = 0; i < toIntake.length; i++) {
            intake[i] = toIntake[i];
        }
        Matrix b = new Matrix(new double[][]{intake});
        System.out.println(topIngredientsNames[2]);
        for (String ingredient1 : topIngredientsNames[0]) {
            for (String ingredient2 : topIngredientsNames[1]) {
                for (String ingredient3 : topIngredientsNames[2]) {
                    HashMap<String, Float> combo = new HashMap<>();
                    Matrix A = getMatrix(ingredient1, ingredient2, ingredient3);
                    double[] x = A.times(b.transpose()).getArrayCopy()[0];
                    combo.put(ingredient1, (float) x[0]);
                    combo.put(ingredient2, (float) x[0]);
                    combo.put(ingredient3, (float) x[0]);
                    combinations.add(combo);
                }
            }
        }
    }

    private Matrix getMatrix(String n1, String n2, String n3) {
        double[][] matrix = new double[numCharacteristics][numNutrients];
        for (int c = 0; c < numNutrients; c++) {
            for (int r = 0; r < numCharacteristics; r++) {
                matrix[r][c] = foodData.get(n1)[r];
            }
        }
        return new Matrix(matrix);
    }

    private void getTopIngredients(
                                    float[] toIntake, 
                                    ArrayList<String>[] topIngredientsNames
                                  ) 
    {
        ArrayList<Float>[] topIngredientsValues = new ArrayList[numNutrients];
        for (int i = 0; i < numNutrients; i++) {
            topIngredientsValues[i] = new ArrayList<Float>();
        }
        for (int i = 0; i < numNutrients; i++) {
            for (String key : sorted[i].keySet()) {
                addCap(
                        topIngredientsValues[i], 
                        topIngredientsNames[i], 
                        key, 
                        sorted[i].get(key), 
                        toIntake[i]
                      );
            }
        }
    }

    private void addCap(
                        ArrayList<Float> currentBestValues, 
                        ArrayList<String> currentBestNames, 
                        String name, 
                        float contentionValue, 
                        float baseline
                        ) 
    {
        float diff = Math.abs(contentionValue-baseline);
        if (diff > TOLERANCE) {
        } else if (currentBestValues.size() < NUMTOP) {
            currentBestValues.add(contentionValue);
            currentBestNames.add(name);
        } else {
            for (int i = 0; i < NUMTOP; i++) {
                if (diff < Math.abs(currentBestValues.get(i)-baseline)) {
                    currentBestValues.remove(i);
                    currentBestNames.remove(i);
                    currentBestValues.add(contentionValue);
                    currentBestNames.add(name);
                }
            }
        }
    }

    /**
     * Each user has a meal plan for the day composed of the amount of calories, nutrients, etc.
     * At any given meal, the user is either (behind, on track, or over) their expected intake values. 
     * 
     * If the user is over their expected intake values, then a negative value for the next meal is returned.
     * This is a way of biasing the matching step against foods with any value in that category. 
     * 
     * @param user: The user to calculate best next meal value combination. 
     * 
     * @return Returns the best next meal value combination. 
     */
    private float[] getMealIntake(User user) {
        float[] meal = user.getNextMeal(), currentIntake = user.getCurrentIntake(), expectedIntake = user.getExpectedIntake();
        float[] nextMeal = new float[meal.length];
        for (int i = 0; i < meal.length; i++) {
            // nextMeal[i] = meal[i] + expectedIntake[i] - currentIntake[i];
            nextMeal[i] = meal[i] + expectedIntake[i];
        }
        return nextMeal;
    }

    public static void main(String[] args) {
        try {
            File file = new File("data/data.txt");
            HashMap<String, float[]> data = new HashMap<String, float[]>();
            BufferedReader reader = new BufferedReader(new FileReader(file));
            for (String line = reader.readLine(); line != null; line = reader.readLine()) {
                String[] split = line.split("::");
                ArrayList<Float> vals = new ArrayList<Float>();
                for (int i = 1; i < split.length; i++) {
                    vals.add(Float.parseFloat(split[i]));
                }
                float[] valsArray = new float[vals.size()];
                for (int i = 0; i < vals.size(); i++) {
                    valsArray[i] = vals.get(i)/vals.get(vals.size()-1);
                }
                data.put(split[0], valsArray);
            }
            RecommendValues rv = new RecommendValues(data);
            User user = new User("Brian Yu");
            // user.load();
            user.addMeal(new float[]{100, 300, 200});
            System.out.println(rv.match(user).get(0));
            // user.save();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}