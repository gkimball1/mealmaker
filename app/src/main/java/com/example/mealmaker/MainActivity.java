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
        setContentView(R.layout.activity_main);
    }

    public void goToUserInput(View view) {
        SharedPreferences preferences = getSharedPreferences(PREFS_FILE, MODE_PRIVATE);
        if (preferences.getBoolean("log", false)) {
            Intent intent = new Intent(this, homepage.class);
            startActivity(intent);
        }
        else {
            Intent intent = new Intent(this, userInput.class);
            startActivity(intent);
        }
    }
}
