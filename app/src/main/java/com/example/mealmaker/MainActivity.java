package com.example.mealmaker;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {
    public static final String PREFS_FILE = "user_data";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SharedPreferences pref = getSharedPreferences(PREFS_FILE, MODE_PRIVATE);

        if (pref.getBoolean("log", false)) {
            Intent intent = new Intent(this, ActivityOptions.class);
            startActivity(intent);
        }
        else { // initialize variables and show the main method
            SharedPreferences.Editor editor = getSharedPreferences(PREFS_FILE, MODE_PRIVATE).edit();
            editor.putString("name", "");
            editor.putInt("weight", 0);
            editor.putInt("height", 0);
            editor.putInt("age", 0);
            editor.putInt("gender", 'a');
            editor.putFloat("activity", (float) 0.0);
            editor.putInt("calories", 0);
            editor.putInt("eaten", 0);
            editor.apply();
            setContentView(R.layout.activity_main);
        }
    }

    public void goToUserInput(View view) {
        Intent intent = new Intent(this, userInput.class);
        startActivity(intent);
    }
}
