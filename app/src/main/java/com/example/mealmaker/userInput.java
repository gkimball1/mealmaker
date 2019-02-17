package com.example.mealmaker;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;

public class userInput extends AppCompatActivity {
    public static final String PREFS_FILE = "user_data";

    char userGender = ' ';

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_input);

        Switch s1 = (Switch) findViewById(R.id.weight_switch);
        Switch s2 = (Switch) findViewById(R.id.height_switch);

        final Button b1 = findViewById(R.id.femaleButton);
        final Button b2 = findViewById(R.id.maleButton);

        final TextView tv1 = (TextView) findViewById(R.id.weightUnits);
        final TextView tv2 = (TextView) findViewById(R.id.heightUnits);

        s1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked) tv1.setText(R.string.kg_text);
                else tv1.setText(R.string.lbs_text);
            }
        });

        s2.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked) tv2.setText(R.string.cm_text);
                else tv2.setText(R.string.inches_text);
            }
        });

        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PorterDuffColorFilter grayFilt = new PorterDuffColorFilter(Color.GRAY, PorterDuff.Mode.MULTIPLY);
                b1.getBackground().setColorFilter(grayFilt);
                b2.getBackground().setColorFilter(null);
                userGender = 'f';
            }
        });

        b2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PorterDuffColorFilter grayFilt = new PorterDuffColorFilter(Color.GRAY, PorterDuff.Mode.MULTIPLY);
                b2.getBackground().setColorFilter(grayFilt);
                b1.getBackground().setColorFilter(null);
                userGender = 'm';
            }
        });
    }

    private double mifflinJeor(int weight, int height, int age, char gender, double activity) {
        if (gender == 'f') return java.lang.Math.max(0, activity*(10*weight+6.25*height-5*age-161));
        return java.lang.Math.max(0, activity*(10*weight+6.25*height-5*age+5));
    }

    public void storeData(View view) {
        EditText ed1 = (EditText) findViewById(R.id.nameText);
        EditText ed2 = (EditText) findViewById(R.id.weightText);
        EditText ed3 = (EditText) findViewById(R.id.heightText);
        EditText ed4 = (EditText) findViewById(R.id.ageText);
        EditText ed5 = (EditText) findViewById(R.id.activityText);
        Switch s1 = (Switch) findViewById(R.id.weight_switch);
        Switch s2 = (Switch) findViewById(R.id.height_switch);
        Button b1 = findViewById(R.id.femaleButton);
        Button b2 = findViewById(R.id.maleButton);

        String userName = ed1.getText().toString();
        int userWeight = Integer.parseInt(ed2.getText().toString());
        int userHeight = Integer.parseInt(ed3.getText().toString());
        int userAge = Integer.parseInt(ed4.getText().toString());
        double userActivity = Integer.parseInt(ed5.getText().toString());

        userActivity = 1.2+(userActivity/5)*0.7;
        if(!s1.isChecked()) userWeight /= 2.20462;
        if(!s2.isChecked()) userHeight *= 2.54;

        SharedPreferences.Editor editor = getSharedPreferences(PREFS_FILE, MODE_PRIVATE).edit();
        editor.putString("name", userName);
        editor.putInt("weight", userWeight);
        editor.putInt("height", userHeight);
        editor.putInt("age", userAge);
        editor.putInt("gender", userGender);
        editor.putFloat("activity", (float) userActivity);
        editor.putInt("calories",
                (int) mifflinJeor(userWeight, userHeight, userAge, userGender, userActivity));
        editor.putBoolean("log", true);
        editor.apply();

        Intent intent = new Intent(this, ActivityOptions.class);
        startActivity(intent);
    }
}
