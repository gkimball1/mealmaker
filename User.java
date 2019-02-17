import java.util.ArrayList;
import java.io.*;

public class User {

    private float[] currentIntake = new float[]{0, 0, 0}, expectedIntake = new float[]{450, 300, 250};
    private ArrayList<float[]> history;
    private String name, gender, activity, log;
    private int weight, height, age, calories;
    private int meals = 1, numMeals = 3;

    /**
     * Each user has a set of personal data. 
     */
    public User(String name) {
        this.name = name;
    }

    /** 
     * @return Returns the user's next meal value plan. 
     */
    public float[] getNextMeal() {
        return new float[]{150, 100, 83};
    }

    public float[] getCurrentIntake() {
        return currentIntake;
    }

    public float[] getExpectedIntake() {
        return expectedIntake;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public void setExpectedIntake(double carbs, double protein, double fat) {
        this.expectedIntake = new float[]{(float) carbs*1000, (float) protein*1000, (float) fat*1000};
    }

    public void addMeal(float[] meal) {
        for (int i = 0; i < meal.length; i++) {
            currentIntake[i] += meal[i];
        }
        meals++;
        if (meals == numMeals) {
            meals = 0;
            history.add(currentIntake);
            currentIntake = new float[]{0, 0, 0};
        }
    }

    public void load() {
        try {
            File file = new File("data/user.txt");
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line = reader.readLine();
            System.out.println(line);
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void save() {
        try {
            File file = new File("data/user.txt");
            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            writer.write(name + " " + calories);
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
    }
}
