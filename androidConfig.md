============>For  sqlite  <===================
1)settings.gradle (04/12/2018)
include ':react-native-sqlite-storage'
project(':react-native-sqlite-storage').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-sqlite-storage/src/android')


2)android/app/build.gradle (04/12/2018)

dependencies {
   compile project(':react-native-sqlite-storage')   
}

3)android/app/src/main/java/mymoney/MainApplicaiton.java
import org.pgsqlite.SQLitePluginPackage;
 new SQLitePluginPackage(),

==============> for BASE_MAP.Fill not a funcation <===============
1)package.json<br>
dependencies {
 + "jsc-android": "236355.x.x",<br>

  2)android/build.gradle<br>
  allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
+       maven {
+           // Local Maven repo containing AARs with JSC library built for Android
+           url "$rootDir/../node_modules/jsc-android/dist"
+       }
    }
}<br>

3)android/app/build.gradle
}

+configurations.all {
+    resolutionStrategy {
+        force 'org.webkit:android-jsc:r236355'
+    }
+}
  
dependencies {
    compile fileTree(dir: "libs", include: ["*.jar"])<br>

4)app/build.gradle, under android:<br>  
packagingOptions {
    pickFirst '**/libgnustl_shared.so'
}  
  



